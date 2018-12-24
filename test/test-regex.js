/* eslint-disable no-console */
function testRegex () {
  var HTML_CMNT = /<!--(?:>|[\s\S]*?--\s*>)/g
  var html = [
    '<!DOCTYPE html><!--[if lt IE 7]>',
    '  <html class="no-js lt-ie9 lt-ie8 lt-ie7">',
    ' <![endif]-->',
    '<!-- comment 1 --><!--comment 2--><!--x-- >',
    '<html lang="en">',
    '<head><meta charset="UTF-8"><title>Document</title></head>',
    '<body><!--><!----></body><!--',
    '-->',
    '</html>',
  ].join('\n')

  var result = html.match(HTML_CMNT)
  var res = []
  res[0] = result[0] === '<!--[if lt IE 7]>\n  <html class="no-js lt-ie9 lt-ie8 lt-ie7">\n <![endif]-->'
  res[1] = result[1] === '<!-- comment 1 -->'
  res[2] = result[2] === '<!--comment 2-->'
  res[3] = result[3] === '<!--x-- >'
  res[4] = result[4] === '<!-->'
  res[5] = result[5] === '<!---->'
  res[6] = result[6] === '<!--\n-->'
  return res
}
