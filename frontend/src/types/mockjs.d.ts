declare module 'mockjs' {
  interface MockjsRandom {
    natural(min?: number, max?: number): number;
    integer(min?: number, max?: number): number;
    float(min?: number, max?: number, dmin?: number, dmax?: number): number;
    character(pool?: string): string;
    string(pool?: string, min?: number, max?: number): string;
    string(min?: number, max?: number): string;
    range(start: number, stop: number, step?: number): number[];
    date(format?: string): string;
    time(format?: string): string;
    datetime(format?: string): string;
    now(unit?: string, format?: string): string;
    image(size?: string, background?: string, foreground?: string, format?: string, text?: string): string;
    color(): string;
    hex(): string;
    rgb(): string;
    rgba(): string;
    hsl(): string;
    paragraph(min?: number, max?: number): string;
    sentence(min?: number, max?: number): string;
    word(min?: number, max?: number): string;
    title(min?: number, max?: number): string;
    cparagraph(min?: number, max?: number): string;
    csentence(min?: number, max?: number): string;
    cword(pool?: string, min?: number, max?: number): string;
    cword(min?: number, max?: number): string;
    ctitle(min?: number, max?: number): string;
    first(): string;
    last(): string;
    name(middle?: boolean): string;
    cfirst(): string;
    clast(): string;
    cname(): string;
    url(): string;
    domain(): string;
    protocol(): string;
    tld(): string;
    email(): string;
    ip(): string;
    region(): string;
    province(): string;
    city(prefix?: boolean): string;
    county(prefix?: boolean): string;
    zip(): string;
    guid(): string;
    id(): string;
    increment(step?: number): number;
    inc(step?: number): number;
    pick<T>(arr: T[]): T;
    shuffle<T>(arr: T[]): T[];
    bool(min?: number, max?: number, current?: number): boolean;
    boolean(min?: number, max?: number, current?: number): boolean;
  }

  interface MockjsStatic {
    Random: MockjsRandom;
    mock<T>(template: T): T;
    mock(rurl: string | RegExp, rtype: string, template: any): void;
    mock(rurl: string | RegExp, template: any): void;
    setup(settings: { timeout?: string | number }): void;
    valid(template: any, data: any): boolean;
    toJSONSchema(template: any): any;
  }

  const Mock: MockjsStatic;
  export = Mock;
}
