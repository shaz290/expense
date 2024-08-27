import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema'
const sql = neon('postgresql://neondb_owner:DFW6lMT5GZHS@ep-divine-union-a5u4y5pm.us-east-2.aws.neon.tech/Expenses-Tracket?sslmode=require');
export const db = drizzle(sql,{schema});