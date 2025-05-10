import { ConfigService } from "@nestjs/config";
import { JwtStrategy } from "./jwt.strategy";
import { Test, TestingModule } from "@nestjs/testing";

describe("JwtStrategy", () => {
  let strategy: JwtStrategy;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtStrategy, ConfigService],
    }).compile();
    strategy = module.get(JwtStrategy);
  });

  it("should be defined", () => {
    expect(strategy).toBeDefined();
  });

  it("should return user", () => {
    const payload = {
      id: 1,
      name: "User",
      email: "user@gmail.com",
    };
    const result = strategy.validate(payload);

    expect(result).toEqual({
      id: 1,
      name: "User",
      email: "user@gmail.com",
    });
  });
});
