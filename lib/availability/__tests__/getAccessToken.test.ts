import getAccessToken from "../getAccessToken"

const originalFetch = global.fetch

describe("getAccessToken", () => {
  beforeEach(() => {
    jest.spyOn(global, "fetch").mockImplementation()
  })

  afterEach(() => {
    global.fetch = originalFetch
    delete process.env.GOOGLE_OAUTH_SECRET
    delete process.env.GOOGLE_OAUTH_REFRESH
    delete process.env.GOOGLE_OAUTH_CLIENT_ID
  })

  it("throws an error if GOOGLE_OAUTH_SECRET is not set", async () => {
    await expect(getAccessToken()).rejects.toThrow(
      "GOOGLE_OAUTH_SECRET not set"
    )
  })

  it("throws an error if GOOGLE_OAUTH_REFRESH is not set", async () => {
    process.env.GOOGLE_OAUTH_SECRET = "test_secret"

    await expect(getAccessToken()).rejects.toThrow(
      "GOOGLE_OAUTH_REFRESH not set"
    )
  })

  it("throws an error if GOOGLE_OAUTH_CLIENT_ID is not set", async () => {
    process.env.GOOGLE_OAUTH_SECRET = "test_secret"
    process.env.GOOGLE_OAUTH_REFRESH = "test_refresh"

    await expect(getAccessToken()).rejects.toThrow(
      "GOOGLE_OAUTH_CLIENT_ID not set"
    )
  })

  it("successfully retrieves an access token", async () => {
    process.env.GOOGLE_OAUTH_SECRET = "test_secret"
    process.env.GOOGLE_OAUTH_REFRESH = "test_refresh"
    process.env.GOOGLE_OAUTH_CLIENT_ID = "test_client_id"

    const accessToken = "test_access_token"
    const mockJson = { access_token: accessToken }
    const mockResponse = new Response(JSON.stringify(mockJson), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })

    ;(fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(
      mockResponse
    )

    const result = await getAccessToken()

    expect(result).toStrictEqual(accessToken)
  })

  it("throws an error if access_token is not in the response", async () => {
    process.env.GOOGLE_OAUTH_SECRET = "test_secret"
    process.env.GOOGLE_OAUTH_REFRESH = "test_refresh"
    process.env.GOOGLE_OAUTH_CLIENT_ID = "test_client_id"

    const mockJson = { error: "invalid_grant" }
    const mockResponse = new Response(JSON.stringify(mockJson), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })

    ;(fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(
      mockResponse
    )

    await expect(getAccessToken()).rejects.toMatchObject({
      message: expect.stringMatching(/Couldn't get access token/),
    })
  })
})
