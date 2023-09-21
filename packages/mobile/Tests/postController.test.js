import * as PostController from "backend/PostController";
const pc = PostController.pc


test('Create new post should be true', async () => {
    const data = await pc.createPostDocument('5yEzavRHx6gAFNTIsb9XMARPvHn1', 'This is a test post', null)

    expect(data).toBe(true);
});

test('Create new comment should return true', async () => {
    const data = await pc.createCommentDocument('5yEzavRHx6gAFNTIsb9XMARPvHn1', '5yEzavRHx6gAFNTIsb9XMARPvHn1', 'abfccd6f-dcb2-4449-bf5c-ac85cfada0ea' ,'This is a test comment')

    expect(data).toBe(true);
});