export class Staff {
  constructor(
    public name: string,
    public position: string,
    public phone: string,
    public email: string,
    public team: string,
    public position_jp: string,
    public team_jp: string,
    public position_en: string,
    public team_en: string,
    public role?: string,
    public role_en?: string,
    public role_jp?: string,
    public id?: number,
  ) {}
}
