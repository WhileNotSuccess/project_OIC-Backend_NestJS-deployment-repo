import { Test, TestingModule } from "@nestjs/testing";
import { JwtService } from "@nestjs/jwt";
import { TokenService } from "./token.service";

describe("TokenService", () => {
  let tokenService: TokenService;
  let jwtService: jest.Mocked<JwtService>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    tokenService = module.get<TokenService>(TokenService);
    jwtService = module.get(JwtService);
  });

  it("should be defined", () => {
    expect(tokenService).toBeDefined();
  });

  it("should generate a JWT token with correct payload and expiry", async () => {
    const mockToken = "fake_token";
    jwtService.signAsync.mockResolvedValue(mockToken);

    const userId = 1;
    const name = "user";
    const email = "user@gmail.com";

    const result = await tokenService.generateAccessToken(userId, name, email);

    expect(jwtService.signAsync).toHaveBeenCalledWith(
      { id: userId, name, email },
      { expiresIn: "1h" },
    );
    expect(result).toBe(mockToken);
  });
});
