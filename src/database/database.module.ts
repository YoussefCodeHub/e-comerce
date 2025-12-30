import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import 'dotenv/config';

const { DB_USERNAME, DB_PASSWORD, DB_CLUSTER, DB_NAME } = process.env;

const uri = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_CLUSTER}.r047aq3.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=${DB_CLUSTER}`;

@Module({
  imports: [MongooseModule.forRoot(uri)],
})
export class DatabaseModule {}
