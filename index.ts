import app from './app'
import morgan from 'morgan';

const port = 3000;

app.use(morgan('dev'))

app.listen(port, () => {
    console.log(`APP IS RUNNING ON PORT: ${port}.`)
})

