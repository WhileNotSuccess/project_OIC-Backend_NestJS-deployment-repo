import { AuthRepository } from "src/auth/domain/repositories/user-credential.repository";
import { GoogleStrategy } from "./google.strategy";
import { ConfigService } from "@nestjs/config";
import { CreateGoogleUserUseCase } from "src/auth/application/use-cases/create-user-google.use-case";
import { Profile } from "passport-google-oauth20";
import { BadRequestException } from "@nestjs/common";

describe("GoogleStrategy", () => {
  const mockClientID = "mock-client-id";
  const mockClientSecret = "mock-client-secret";
  const mockCallbackURL = "http://localhost/callback";

  let mockConfigService: { get: jest.Mock };
  let strategy: GoogleStrategy;
  let authRepository: { findByGoogleId: jest.Mock };
  let googleUserCreate: { execute: jest.Mock };

  const mockProfile = {
    id: "google-id",
    displayName: "Test User",
    emails: [{ value: "test@example.com", verified: true }],
    photos: [{ value: "photo-url" }],
    provider: "google",
  } as Profile;

  beforeAll(() => {
    mockConfigService = {
      get: jest
        .fn()
        .mockReturnValueOnce(mockClientID) // GOOGLE_CLIENT_ID
        .mockReturnValueOnce(mockClientSecret) // GOOGLE_SECRET
        .mockReturnValueOnce(mockCallbackURL), // GOOGLE_CALLBACK_LINK_URL
    };
    authRepository = {
      findByGoogleId: jest.fn(),
    };
    googleUserCreate = {
      execute: jest.fn(),
    };

    strategy = new GoogleStrategy(
      authRepository as unknown as AuthRepository,
      mockConfigService as unknown as ConfigService,
      googleUserCreate as unknown as CreateGoogleUserUseCase,
    );
  });
  it("should be defined", () => {
    expect(strategy).toBeDefined();
  });

  it("should return existing user info", async () => {
    authRepository.findByGoogleId.mockResolvedValueOnce({ id: 1 });

    const result = await strategy.validate(
      "access_token",
      "refresh",
      mockProfile,
    );

    expect(result).toEqual({
      sub: mockProfile.id,
      name: mockProfile.displayName,
      email: mockProfile.emails![0].value,
      newUser: false,
    });
  });

  it("should create and return new user if user not found", async () => {
    authRepository.findByGoogleId.mockResolvedValueOnce(null);
    googleUserCreate.execute.mockResolvedValueOnce({
      id: 2,
      name: mockProfile.displayName,
      email: mockProfile.emails![0].value,
      createDate: new Date(),
    });

    const result = await strategy.validate(
      "access_token",
      "refresh",
      mockProfile,
    );

    expect(result).toMatchObject({
      sub: mockProfile.id,
      name: mockProfile.displayName,
      email: mockProfile.emails![0].value,
      newUser: true,
    });
  });

  it("should throw BadRequestException if no email", async () => {
    const profileWithoutEmail = { ...mockProfile, emails: undefined };

    await expect(
      strategy.validate(
        "access_token",
        "refresh",
        profileWithoutEmail as Profile,
      ),
    ).rejects.toThrow(BadRequestException);
  });
});
