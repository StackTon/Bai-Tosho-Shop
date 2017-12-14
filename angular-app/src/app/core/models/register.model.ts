export class RegisterModel {
  constructor(
    public username : string,
    public password : string,
    public repeatPassword: string,
    public firstName? : string,
    public lastName? : string
  ) { }
}