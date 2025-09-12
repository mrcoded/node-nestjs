
const { countPostsByUser, avgPostsPerUser } = require('./concepts/aggregation')
const {
  insertUser,
  fetchAllUsers,
  deleteInfo,
  updateUserInfo,
  createUserTable,
} = require('./concepts/basic-queries')

const {
  getUsersWhere,
  getSortedUsers,
  getPaginatedUsers
} = require('./concepts/filtering-sorting')
const { getUsersWithPosts, getAllUsersAndTheirPosts } = require('./concepts/joins')
const { createPostsTable, insertNewPost } = require('./concepts/relationships')

//test queries
async function testBasicQueries(params) {
  try {
    await createUserTable()

    // Insert new users
    await insertUser("CodedLibra", "decoded@gmail.com")
    await insertUser("DonLibra", "donlibra@gmail.com")
    await insertUser("AdeCoded", "adecoded@gmail.com")
    await insertUser("DonRapahy", "donraphy@gmail.com")
    await insertUser("CodedLord", "codedlord@gmail.com")

    const allUsers = await fetchAllUsers()
    console.log("All Users", allUsers);

    const updatedUser = await updateUserInfo('CodedLibra', "test@gmail.com")
    console.log(updatedUser)

    const deleteUser = await deleteInfo('CodedLibra')
    console.log(deleteUser);
  } catch (error) {
    console.error("Error", error);
  }
}

async function testFilterAndSortQueries() {
  try {
    //get users with a username whose usernme starting with c
    const cFilteredUsers = await getUsersWhere("username LIKE 'C%'")
    // console.log(cFilteredUsers);

    const sortedUsers = await getSortedUsers("created_at", "DESC")
    // console.log(sortedUsers);

    const paginatedUsers = await getPaginatedUsers(2, 0)
    console.log(paginatedUsers);

  } catch (error) {
    console.error("Error", error);
  }
}

async function testRelationshipQueries() {
  try {
    // await createPostsTable()
    // await insertNewPost("My first post", "This is coded first post", 2)
    await insertNewPost("My second post", "This is coded second post", 3)
    await insertNewPost("My third post", "This is coded third post", 4)
  } catch (error) {
    console.error("Error", error);
  }
}

async function testJoinQueries() {
  try {
    const usersWithPosts = await getUsersWithPosts()
    console.log(usersWithPosts);

    const allUsersWithAllPosts = await getAllUsersAndTheirPosts()
    // console.log(allUsersWithAllPosts);

  } catch (error) {
    console.error("Error", error);
  }
}

async function testAggregationQueries() {
  try {
    const postCount = await countPostsByUser("username", "DESC")
    // console.log(postCount);

    const avgPostsPerUserInfo = await avgPostsPerUser()
    console.log(avgPostsPerUserInfo);

  } catch (error) {
    console.error("Error", error);
  }
}

async function testAllQueries(params) {
  // await testBasicQueries()
  // await testFilterAndSortQueries()
  // await testRelationshipQueries()
  // await testJoinQueries()
  await testAggregationQueries()
}

testAllQueries()