import { NodeTypes } from "./ast";

const enum TagType {
  Start,
  End
}

export function baseParse (content) {
  const context = createParserContext(content);
  return createRoot(parserChidren(context))
}

function parserChidren (context) {
  const nodes: any[] = []
  let node;
  const s = context.source
  if (s.startsWith('{{')) {
    node = parseInterpolation(context)
  } else if (s[0] === '<') {
    if (/[a-z]/i.test(s[1])) {
      node = parserElement(context)
    }
  }
  nodes.push(node)
  return nodes
}

function parseInterpolation (context) {
  const openDelimiter = '{{'
  const closeDelimiter = '}}'
  const closeIndex = context.source.indexOf(closeDelimiter, closeDelimiter.length)
  advanceBy(context, openDelimiter.length)
  const rawContentLength = closeIndex - openDelimiter.length
  const content = context.source.slice(0, rawContentLength).trim()
  advanceBy(context, rawContentLength + closeDelimiter.length)

  return  {
    type: NodeTypes.INTERPOLATION,
    content: {
      type: NodeTypes.SIMPLE_EXPRESSION,
      content
    }
  }
}

function advanceBy (context:any, length: number) {
  context.source = context.source.slice(length)
}

function createRoot (children) {
  return {
    children
  }
}

function createParserContext(content: any) {
  return {
    source: content
  }
}
function parserElement(context: any) {
  // 1 解析tag
  const element = parseTag(context, TagType.Start)
  parseTag(context, TagType.End)
  return element
}

function parseTag (context, type: TagType) {
  const match :any = /^<\/?([a-z]*)/i.exec(context.source)
  console.log(match)
  const tag = match[1]
  // 2 删除处理完的代码
  advanceBy(context, match[0].length)
  advanceBy(context, 1)
  console.log(context.source)
  if (TagType.End === type) return 
  return {
    type: NodeTypes.ELEMENT,
    tag
  }
}

