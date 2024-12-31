import request from 'supertest';
import app from './app';

interface UserCredentials {
	email: string;
	password: string;
}

const registerUser = async (user: UserCredentials) =>
	request(app).post('/auth/register').send(user);

const loginUser = async (user: UserCredentials) =>
	request(app).post('/auth/login').send(user);

describe('Auth users', () => {
	let user: UserCredentials;

	beforeEach(() => {
		user = {
			email: 'test@example.com',
			password: 'password123',
		};
	});

	test('register a new user', async () => {
		const response = await request(app)
			.post('/auth/register')
			.send({ email: 'demo@example.com', password: 'abc123' });

		expect(response.status).toBe(201);
		expect(response.body.userId).toBeDefined();
	});

	test('rejects duplicate email registration', async () => {
		await request(app)
			.post('/auth/register')
			.send({ email: 'demo@example.com', password: 'abc123' });

		const response = await request(app)
			.post('/auth/register')
			.send({ email: 'demo@example.com', password: 'abc123' });

		expect(response.status).toBe(400);
		expect(response.text).toBe('User already registered.');
	});

	test('login with valid credentials', async () => {
		await registerUser(user);

		const response = await loginUser(user);

		expect(response.status).toBe(200);
		expect(response.body.message).toBe('Login successful');
		expect(response.headers['set-cookie']).toBeDefined();
	});

	test('Reject login with invalid credentials', async () => {
		const invalidUser = {
			email: 'wrong@example.com',
			password: 'wrongpassword',
		};

		const response = await loginUser(invalidUser);

		expect(response.status).toBe(401);
		expect(response.body.error).toBe('Invalid credentials.');
	});

	test('Logout successfully', async () => {
		await registerUser(user);

		const loginResponse = await loginUser(user);
		const sessionCookie = loginResponse.headers['set-cookie'][0];

		const logoutResponse = await request(app)
			.post('/auth/logout')
			.set('Cookie', sessionCookie);

		expect(logoutResponse.status).toBe(200);
		expect(logoutResponse.body.message).toBe('Logout successful');
	});

	test('Logout without a valid session cookie', async () => {
		const response = await request(app)
			.post('/auth/logout')
			.set('Cookie', 'sessionId=invalidSessionId');

		expect(response.status).toBe(401);
		expect(response.body.error).toBe('Not authenticated');
	});
});
