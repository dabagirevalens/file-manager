import { promises as fs } from "fs";
import { DateTime } from "luxon";
import { dirname, join } from "path";
import { FakeAwsFile, FileBucket, SIGNED_URL_EXIPRES } from "./bucket";

const appRoot = require.main?.path[0].split('node_modules')[0].slice(0, -1);

const rootDir = `${appRoot?? "."}/.files`
const baseUrl = `http://localhost:${process.env.LOCAL_PORT ?? 4000}/file`

export function getLocalBucket():FileBucket{
    return{
        getSignedUrl,
        saveFile,
        deleteObject
    }
}

function getSignedUrl(operation : 'get' | 'put', key : string){
    const signed = JSON.stringify({
        operation,
        key,
        expires : DateTime.local().plus(SIGNED_URL_EXIPRES).toMillis()
    })

    const url = new URL(baseUrl);
    url.searchParams.set('signed', signed)

    return Promise.resolve(url.toString())
}

function getPath(key: string):string{
    return join(`${rootDir}`)
}

const fsWrite = fs.writeFile;

async function writeFile(key: string, data: Parameters<typeof fsWrite>[1]) {
    const path = getPath(key);

    await fs.mkdir(dirname(path), {
        recursive: true
    })

    await fs.writeFile(path, data)
}

async function saveFile(key: string, file: FakeAwsFile):Promise<string>{
    const { Body, ...info} = file;

    await writeFile(key, Body)
    await writeFile(`${key}.info`, JSON.stringify({
        ...info,
        contentLenght: Body.byteLength,
        LastModified : new Date()
    }))

    const url = getSignedUrl('get', key)

    return url
}


async function deleteObject(key:string) {
    await fs.unlink(getPath(key))
    await fs.unlink(getPath(key + '.info'))
}
