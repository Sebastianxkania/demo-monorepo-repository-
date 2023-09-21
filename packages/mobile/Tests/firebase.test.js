
import * as backend  from "backend/firebase";






test('Sebastian@gmail.com and seb123 should login', async () => {
    const data = await backend.handleLogin('sebastian@gmail.com', 'seb123')
    expect(data).toBe('DbOvkXfwfQSZiSGgrofUpOVIjnW2');
});

test('New Test account should be created', async () => {
    randomNo = Math.floor(Math.random()*(1000-0+1)+0);
    testUsername = 'test' + randomNo;

    data = await backend.handleSignUp(testUsername, (testUsername + '@gmail.com'), 'testfirstname', 'testlastname', 'test123')        
    expect(data).toBe(data);
});

test('Sign out user should sign out user', async () => {
    const data = await backend.handleSignOut()
    expect(data).toBe(true);
});

test('getUserDetailsByID should get sebastian_kanias user details', async () => {
    const data = await backend.getUserDetailsByID('DbOvkXfwfQSZiSGgrofUpOVIjnW2')
    const userDetails = await data.username 
    expect(userDetails).toBe('sebastian_kania');
});

test('getUserByUsername should get sebastian_kanias user details', async () => {
    const data = await backend.getUserByUsername('sebastian_kania')
    const userDetails = await data.data().username 
    expect(userDetails).toBe('sebastian_kania');
});

test('username sebastian_kania should exist', async () => {
    const data = await backend.usernameExists('sebastian_kania')
    expect(data).toBe(true);
});

test('email sebastian@gmail.com should exist', async () => {
    const data = await backend.emailExists('sebastian@gmail.com')
    expect(data).toBe(true);
});

test('test should follow max11', async () => {
    const data = await backend.followed('5yEzavRHx6gAFNTIsb9XMARPvHn1', '2nXmymHXIKh2l0QGh4rLuhz2S162')
    expect(data).toBe(true);
});

test('test should not follow frank11', async () => {
    const data = await backend.followed('5yEzavRHx6gAFNTIsb9XMARPvHn1', 'uH2PPtOlbihAO8o0GOkYbsHtJRF2')
    expect(data).toBe(false);
});

test('tests first name should be updated to Ben', async () => {
    const newName = 'Ben'
    await backend.updateFirstName('5yEzavRHx6gAFNTIsb9XMARPvHn1', newName)

    const getBen = await backend.getUserDetailsByID('5yEzavRHx6gAFNTIsb9XMARPvHn1')
    const getBensFirstName = await getBen.firstName 
    expect(getBensFirstName).toBe(newName);
});

test('tests last name should be updated to Ten', async () => {
    const newLastName = 'Ten'
    await backend.updateLastName('5yEzavRHx6gAFNTIsb9XMARPvHn1', newLastName)

    const getBen = await backend.getUserDetailsByID('5yEzavRHx6gAFNTIsb9XMARPvHn1')
    const getBensLastName = await getBen.lastName 
    expect(getBensLastName).toBe(newLastName);
});

test('tests bio should be updated to test bio', async () => {
    const newBio = 'test bio'
    await backend.updateBio('5yEzavRHx6gAFNTIsb9XMARPvHn1', newBio)

    const getBen = await backend.getUserDetailsByID('5yEzavRHx6gAFNTIsb9XMARPvHn1')
    const getBensBio = await getBen.bio 
    expect(getBensBio).toBe(newBio);
});

 


