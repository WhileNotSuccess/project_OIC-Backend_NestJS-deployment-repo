import { Module } from "@nestjs/common";
import { TypeormTransactionManager } from "./infra/typeorm-transaction-manager";
import { TransactionManager } from "./ports/transaction-manager.port";

@Module({
  // providers: [TypeormTransactionManager],
  // exports: [TypeormTransactionManager], // 다른 모듈에서도 쓸 수 있게
  providers: [
    { provide: TransactionManager, useClass: TypeormTransactionManager },
  ],
  exports: [TransactionManager], // 다른 모듈에서도 쓸 수 있게
})
export class CommonModule {}
