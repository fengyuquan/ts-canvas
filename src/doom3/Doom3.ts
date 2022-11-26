export enum ETokenType {
  NONE,
  STRING,
  NUMBER,
}

export interface IDoom3Token {
  readonly type: ETokenType
  reset(): void
  isString(str: string): boolean
  // 获取当前Token的字符串值
  getString(): string
  // 获取当前Token的浮点值，只有type为NUMBER时才有值
  getFloat(): number
  getInt(): number
}

export interface IDoom3Tokenizer {
  createIDoom3Token(): IDoom3Token
  setSource(source: string): void // 设置要解析的字符串
  reset(): void // 重置当前索引为0
  getNextToken(token: IDoom3Token): boolean // 获取下一个Token
}

// 只暴露（export）接口（interface），而隐藏类（class）的实现，第三方调用时，只关心接口是怎么使用的，不需要知道具体类是怎么实现的。

class Doom3Token implements IDoom3Token {
  private _type!: ETokenType
  private _charArr: string[] = [] // 字符串数组
  private _val!: number // 如果当前的token是NUMBER类型，则设置该数值，否则忽略

  constructor() {
    this.reset()
  }

  reset(): void {
    this._charArr.length = 0
    this._type = ETokenType.NONE
    this._val = 0.0
  }

  get type(): ETokenType {
    return this._type
  }

  getString(): string {
    return this._charArr.join('')
  }

  getFloat(): number {
    return this._val
  }

  getInt(): number {
    return parseInt(this._val.toString())
  }

  isString(str: string): boolean {
    const count = this._charArr.length
    if (str.length !== count) {
      return false
    }

    // 遍历每个字符
    for (let i = 0; i < count; i++) {
      // 只有存在一个字符不相等，则整个字符串不等
      if (this._charArr[i] !== str[i]) {
        return false
      }
    }

    return true
  }

  // ------非接口方法，仅内部使用------
  // 将一个char添加到_charArr数组的末尾
  addChar(c: string): void {
    this._charArr.push(c)
  }

  // 设置数字，并将类型设置为NUMBER
  setVal(num: number): void {
    this._val = num
    this._type = ETokenType.NUMBER
  }

  // 设置类型
  setType(type: ETokenType): void {
    this._type = type
  }
}

class Doom3Tokenizer implements IDoom3Tokenizer {
  private _source = 'Doom3Tokenizer'
  private _currIdx = 0
  private _len = 0
  // 使用了初始化表达式方式初始化字符串数组
  private _digits = new Map(
    Object.entries({
      '0': 1,
      '1': 1,
      '2': 1,
      '3': 1,
      '4': 1,
      '5': 1,
      '6': 1,
      '7': 1,
      '8': 1,
      '9': 1,
    })
  )
  private _whiteSpaces = [' ', '\t', '\n']

  private _isDigit(c: string): boolean {
    return !!this._digits.get(c)
  }

  private _isWhiteSpace(c: string): boolean {
    for (const v of this._whiteSpaces) {
      if (c === v) {
        return true
      }
    }

    return false
  }

  // 将左边和右边的大、中、小括号及点号逗号都当作单独的Token进行处理
  // 如果想要增加更多的标点符号作为Token，可以在本函数中进行添加
  private _isSpecialChar(c: string): boolean {
    switch (c) {
      case '(':
        return true
      case ')':
        return true
      case '[':
        return true
      case ']':
        return true
      case '{':
        return true
      case '}':
        return true
      case ', ':
        return true
    }
    return false
  }

  // 跳过所有的空白字符，移动索引直到返回非空字符
  private _skipWhiteSpace(): string {
    let c = ''
    do {
      c = this._getChar()
    } while (this._isWhiteSpace(c))

    return c
  }

  // 跳过单行注释
  private _skipCommentSingle(): string {
    let c = ''
    do {
      c = this._getChar()
    } while (c !== '\n')
    // 结束条件：遇到换行符

    // 此时c是'\n'，但索引指向下一位
    return c
  }

  // 跳过多行注释
  private _skipCommentMult(): string {
    // 进入本函数时，当前索引是 / 字符
    let c = ''
    // 1 读取*号
    c = this._getChar()
    // 2 读取所有非 */ 这两个符号结尾的所有字符
    do {
      c = this._getChar()
    } while (c !== '*' || this._peekChar() !== '/')
    // 3 上面遇到 */ 连在一起的，且读取到*就退出了，所以要把/也读取并处理掉
    c = this._getChar()
    // 此时c是'/'，但索引指向下一位
    return c
  }

  // 获取当前的索引指向的char，并且将索引加1
  private _getChar(): string {
    if (this._currIdx >= 0 && this._currIdx < this._len) {
      return this._source.charAt(this._currIdx++)
    } else {
      return ''
    }
  }

  // 探测下一个字符是什么
  private _peekChar(): string {
    if (this._currIdx >= 0 && this._currIdx < this._len) {
      return this._source.charAt(this._currIdx)
    } else {
      return ''
    }
  }

  // 将索引前移1位
  private _ungetChar(): void {
    if (this._currIdx > 0) {
      this._currIdx--
    }
  }

  // 获取当前字符（可能是数字、小数点、负号）
  // 如： +3.14 3.14 ，-3.14 ，.14 ，-.14 ，3. ，-3.
  private _getNumber(token: Doom3Token): void {
    let isFloat = false
    let c = this._getChar()

    // 将首字符添加进token中
    // 不管它是 + 或者 - 或者 数字。在后面只要出现非数字的都判断结束
    // 只有小数点 可能会出现在首位或非首位，所以做一个记录
    token.addChar(c)
    if (c === '.') {
      isFloat = true
    }

    // 将字符循环的加入token charArr中，直到出现非数字，且它是小数点，但第一次出现小数点，才继续循环
    while (true) {
      c = this._getChar()
      // c是数字，或者c不是数字，但c是小数点且第一次出现
      if (this._isDigit(c) || (!this._isDigit(c) && c === '.' && !isFloat)) {
        if (c === '.') {
          isFloat = true
        }
        token.addChar(c)
      } else {
        this._ungetChar()
        break
      }
    }

    // 设置token值及其类型
    token.setVal(parseFloat(token.getString()))
  }

  // 解析由单或双引号包含的字符串
  private _getSubstring(token: Doom3Token, endChar: string): void {
    let c = ''
    token.setType(ETokenType.STRING)

    while (true) {
      c = this._getChar()
      if (c === endChar) {
        break
      }
      token.addChar(c)
    }
  }

  // 解析不带单或双引号包含的字符串，或特殊符号
  private _getString(token: Doom3Token): void {
    let c = ''
    token.setType(ETokenType.STRING)

    while (true) {
      c = this._getChar()
      // 如果c是空白字符，跳出循环
      if (this._isWhiteSpace(c)) {
        break
      }
      token.addChar(c)
    }
  }

  createIDoom3Token(): IDoom3Token {
    return new Doom3Token()
  }

  // 设置要解析的字符串，并重置当前索引
  setSource(source: string): void {
    this._source = source
    this._currIdx = 0
    this._len = source.length
  }

  // 不改变要解析的字符串，仅仅重置索引
  reset(): void {
    this._currIdx = 0
  }

  getNextToken(token: IDoom3Token): boolean {
    // as 向下转型
    let tok: Doom3Token = token as Doom3Token
    let c = ''

    tok.reset()
    do {
      // 1 跳过所有空白符，返回第一个可显示的字符
      c = this._skipWhiteSpace()
      // 2 判断非空白字符是什么
      if (c === '/' && this._peekChar() === '/') {
        // 判断是单行注释
        c = this._skipCommentSingle()
      } else if (c === '/' && this._peekChar() === '*') {
        // 判断是多行注释
        c = this._skipCommentMult()
      } else if (
        this._isDigit(c) ||
        c === '-' ||
        c === '+' ||
        (c === '.' && this._isDigit(this._peekChar()))
      ) {
        // 如果c是数字，或者c是负号，或者c是小数点且下一位是数字
        // 则是数字。回退索引，单独调用处理数字的方法
        this._ungetChar()
        this._getNumber(tok)
        return true
      } else if (c === '"' || c === "'") {
        // 判断是 单双引号，则获取子串
        this._getSubstring(tok, c)
        return true
      } else if (c.length > 0) {
        // 排除上述所有条件，且数据源没有解析完
        // 返回上一个索引，交由_getString处理
        this._ungetChar()
        this._getString(tok)
        return true
      }
    } while (c.length > 0)

    return false
  }
}

export class Doom3Factory {
  public static createDoom3Tokenizer(): IDoom3Tokenizer {
    return new Doom3Tokenizer()
  }
}
