import {
  ETokenType,
  IDoom3Token,
  IDoom3Tokenizer,
  Doom3Factory,
} from '../src/doom3/Doom3'

test('Doom3', () => {
  const str: string = `                      
    numMeshes  5
    /*
     * joints关键字定义了骨骼动画的bindPose
    */

    joints  {
      "origin" -1  ( 0 0 0 )  ( -0.5  +0.5  -0.5 )
      "Body"    0  ( -12.1038131714  0  79.004776001 )  ( -0.5-0.5-0.5 )
      // origin
    }
    `
  const res: string[] = [
    'numMeshes',
    '5',
    'joints',
    '{',
    'origin',
    '-1',
    '(',
    '0',
    '0',
    '0',
    ')',
    '(',
    '-0.5',
    '+0.5',
    '-0.5',
    ')',
    'Body',
    '0',
    '(',
    '-12.1038131714',
    '0',
    '79.004776001',
    ')',
    '(',
    '-0.5',
    '-0.5',
    '-0.5',
    ')',
    '}',
  ]

  const test_res: string[] = []
  const tokenizer: IDoom3Tokenizer = Doom3Factory.createDoom3Tokenizer()
  const token: IDoom3Token = tokenizer.createIDoom3Token()

  tokenizer.setSource(str)

  while (tokenizer.getNextToken(token)) {
    test_res.push(token.getString())

    // if (token.type === ETokenType.NUMBER) {
    //   console.log('number:\t', token.getFloat())
    // } else if (token.type === ETokenType.STRING) {
    //   console.log('string\t', token.getString())
    // }
  }
  expect(test_res).toEqual(res)
})
