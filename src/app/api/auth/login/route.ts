import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  const { email, password } = await request.json();
  const client = await clientPromise;
  const db = client.db('tu_base_de_datos');
  const user = await db.collection('users').findOne({ email });

  if (user && bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    const response = NextResponse.json({ success: true, message: 'Inicio de sesión exitoso' });
    response.cookies.set('token', token, { httpOnly: true, maxAge: 3600 });
    return response;
  } else {
    return NextResponse.json({ success: false, message: 'Credenciales inválidas' }, { status: 401 });
  }
}