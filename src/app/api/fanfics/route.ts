import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
if (!process.env.MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
  }

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}
const client = new MongoClient(uri);
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    await client.connect();
    const database = client.db('ficnation');
    const fanfics = database.collection('fanfics');
    
    const result = await fanfics.insertOne(body);
    
    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false, error: 'Error al guardar el fanfic' }, { status: 500 });
  } finally {
    await client.close();
  }
}