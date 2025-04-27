// 절대 export 붙이지 말 것! 전역 확장이 안 됨
declare global {
  namespace Express {
    interface User {
      id?: number;
      sub?: string;
      email: string;
      name: string;
    }

    interface Request {
      user: User;
      customData?: {
        jwtUser?: User;
        googleUser?: string;
      };
    }
  }
}

// 이 줄은 파일을 모듈로 인식하지 않도록 유지하기 위해 필요할 수 있음
export {};
