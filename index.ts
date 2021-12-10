import app from './app'
import morgan from 'morgan';

const PORT = process.env.LOCAL_PORT ?? 4000;

app.use(morgan('dev'))

app.listen(PORT, () => {
    console.log(`APP IS RUNNING ON PORT: ${PORT}.`)
})

