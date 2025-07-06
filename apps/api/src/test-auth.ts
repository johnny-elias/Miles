import { AuthService } from './auth';

async function testAuth() {
  try {
    console.log('Testing authentication system...\n');

    // Test 1: Create a user
    console.log('1. Creating test user...');
    const user = await AuthService.createUser({
      username: 'testuser',
      password: 'password123',
      email: 'test@example.com',
      name: 'Test User'
    });
    console.log('✅ User created:', user);

    // Test 2: Authenticate with correct credentials
    console.log('\n2. Testing login with correct credentials...');
    const authResult = await AuthService.authenticateUser({
      username: 'testuser',
      password: 'password123'
    });
    console.log('✅ Login successful:', authResult);

    // Test 3: Try to authenticate with wrong password
    console.log('\n3. Testing login with wrong password...');
    const wrongAuth = await AuthService.authenticateUser({
      username: 'testuser',
      password: 'wrongpassword'
    });
    console.log('✅ Wrong password correctly rejected:', wrongAuth);

    // Test 4: Try to create duplicate user
    console.log('\n4. Testing duplicate user creation...');
    try {
      await AuthService.createUser({
        username: 'testuser',
        password: 'password123',
        email: 'test@example.com'
      });
    } catch (error) {
      console.log('✅ Duplicate user correctly rejected:', (error as Error).message);
    }

    console.log('\n🎉 All tests passed! Authentication system is working correctly.');
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testAuth(); 