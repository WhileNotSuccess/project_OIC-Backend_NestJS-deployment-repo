import { ConfigService } from "@nestjs/config";
import { GoogleLinkStrategy } from "./google-link.strategy";
import { Profile } from "passport-google-oauth20";

describe("GoogleLinkStrategy", () => {
  const mockClientID = "mock-client-id";
  const mockClientSecret = "mock-client-secret";
  const mockCallbackURL = "http://localhost/callback";
  const mockProfile = {
    id: "google-id",
    displayName: "Test User",
    name: { givenName: "Test", familyName: "User" },
    emails: [{ value: "test@example.com", verified: true }],
    photos: [{ value: "http://example.com/photo.jpg" }],
    provider: "google",
  } as Profile;

  let mockConfigService: { get: jest.Mock };
  let strategy: GoogleLinkStrategy;

  beforeAll(() => {
    mockConfigService = {
      get: jest
        .fn()
        .mockReturnValueOnce(mockClientID) // GOOGLE_CLIENT_ID
        .mockReturnValueOnce(mockClientSecret) // GOOGLE_SECRET
        .mockReturnValueOnce(mockCallbackURL), // GOOGLE_CALLBACK_LINK_URL
    };

    strategy = new GoogleLinkStrategy(
      mockConfigService as unknown as ConfigService,
    );
    // 이 시점에서 config.get으로 실행되는 3개의 환경변수를 불러오므로
    // 밑에서 strategy.validate를 몇번 실행해도 환경변수 에러는 동작되지 않음
  });

  it("should be defined", () => {
    expect(strategy).toBeDefined();
  });

  it("should initialize with the correct google oauth credentials", () => {
    expect(mockConfigService.get).toHaveBeenCalledWith("GOOGLE_CLIENT_ID");
    expect(mockConfigService.get).toHaveBeenCalledWith("GOOGLE_SECRET");
    expect(mockConfigService.get).toHaveBeenCalledWith(
      "GOOGLE_CALLBACK_LINK_URL",
    );
  });

  it("should return the profile ID from the validate method", () => {
    const result = strategy.validate(
      "access-token",
      "refresh-token",
      mockProfile,
    );

    expect(result).toBe(mockProfile.id);
  });
});
