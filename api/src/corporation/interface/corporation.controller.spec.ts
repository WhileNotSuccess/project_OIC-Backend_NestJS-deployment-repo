import { Test, TestingModule } from "@nestjs/testing";
import { CorporationController } from "./corporation.controller";
import { CorporationService } from "../application/corporation.service";

describe("CorporationController", () => {
  let controller: CorporationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CorporationController],
      providers: [CorporationService],
    }).compile();

    controller = module.get<CorporationController>(CorporationController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
