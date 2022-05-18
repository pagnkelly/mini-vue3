import { NodeTypes } from "./ast";

const enum TagType {
  Start,
  End
}

export function baseParse (content) {
  const context = createParserContext(content);
  return createRoot(parserChidren(context, []))
}

function parserChidren (context, ancestors) {
  const nodes: any[] = []
  while(!isEnd(context, ancestors)) {
    let node;
    const s = context.source
    console.log(s, '---')
    if (s.startsWith('{{')) {
      node = parseInterpolation(context)
    } else if (s[0] === '<') {
      if (/[a-z]/i.test(s[1])) {
        node = parserElement(context, ancestors)
      }
    }

    if (!node) {
      node = parseText(context)
    }

    nodes.push(node)
  }
  
  return nodes
}

function isEnd(context, ancestors) {
  const s = context.source
  if (s.startsWith('</')) {
    for (let i = ancestors.length - 1; i >= 0; i--) {
      const tag = ancestors[i].tag
      if (startsWithTagOpen(s, tag)) {
        return true
      }
    }
  }
  
  return !s
}

function parseInterpolation (context) {
  const openDelimiter = '{{'
  const closeDelimiter = '}}'
  const closeIndex = context.source.indexOf(closeDelimiter, closeDelimiter.length)
  advanceBy(context, openDelimiter.length)
  const rawContentLength = closeIndex - openDelimiter.length
  const rawContent = parseTextData(context, rawContentLength)
  const content = rawContent.trim()
  advanceBy(context, closeDelimiter.length)

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
function parserElement(context: any, ancestors) {
  // 1 解析tag
  const element:any = parseTag(context, TagType.Start)
  ancestors.push(element)
  element.children = parserChidren(context, ancestors)
  ancestors.pop()

  if (startsWithTagOpen(context.source, element.tag)) {
    parseTag(context, TagType.End)
  } else {
    throw new Error(`缺少结束标签:${element.tag}`)
  }

  return element
}

function parseTag (context, type: TagType) {
  const match :any = /^<\/?([a-z]*)/i.exec(context.source)
  const tag = match[1]
  // 2 删除处理完的代码
  advanceBy(context, match[0].length)
  advanceBy(context, 1)
  if (TagType.End === type) return 
  return {
    type: NodeTypes.ELEMENT,
    tag
  }
}

function parseText(context: any): any {
  let endIndex = context.source.length
  let endTokens = ['<', '{{'] 

  for (let i = 0; i < endTokens.length; i++) {
    const index = context.source.indexOf(endTokens[i])
    if (index !== -1 && endIndex > index) {
      endIndex = index
    }
  }
  

  const content = parseTextData(context, endIndex)
  return {
    type: NodeTypes.TEXT,
    content
  }
}

function parseTextData (context, length) {
  const content = context.source.slice(0, length)
  advanceBy(context, length)
  return content
}

function startsWithTagOpen (source, tag) {
  return source.startsWith('</') && source.slice(2, 2 + tag.length).toLowerCase() === tag.toLowerCase()
}
