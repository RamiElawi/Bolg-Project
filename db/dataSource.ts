import {config} from "dotenv"
import {DataSource,DataSourceOptions} from "typeorm"

config()
export const dataSourceOptions:DataSourceOptions={
    type:'postgres',
    host:process.env.DB_HOST,
    username:process.env.DB_USER_NAME,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_DATA_BASE,
    port:Number(process.env.DB_PORT),
    entities:[__dirname+'/../**/*.entity{.ts,.js}'],
    migrations:['dist/db/migrations/*{.ts,.js}'],
    synchronize:false,
    logging:false
}

const dataSource=new DataSource(dataSourceOptions)
dataSource.initialize()
export default dataSource