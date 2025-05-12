import { Test, TestingModule } from "@nestjs/testing";
import { AdminStrategy } from "./admin.strategy";
import { ConfigService } from "@nestjs/config";
import { UnauthorizedException } from "@nestjs/common";

describe("AdminStrategy", () => {
  let strategy: AdminStrategy;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminStrategy, ConfigService],
    }).compile();

    strategy = module.get<AdminStrategy>(AdminStrategy);
  });

  it("should be defined", () => {
    expect(strategy).toBeDefined();
  });

  it("should throw if email is not admin", () => {
    const payload = {
      id: 1,
      name: "common",
      email: "user@example.com",
    };

    expect(() => strategy.validate(payload)).toThrow(UnauthorizedException);
  });

  it("should return user with admin true if email matches ADMIN_EMAIL", () => {
    const payload = {
      id: 1,
      name: "Admin",
      email: "user@gmail.com",
    };

    const result = strategy.validate(payload);
    expect(result).toEqual({
      id: 1,
      name: "Admin",
      email: "user@gmail.com",
      admin: true,
    });
  });
});
