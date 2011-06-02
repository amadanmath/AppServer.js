#!/usr/bin/env ruby

lines = []
doc = 1;

def sort(doc, lines)
  puts "Document ##{doc}"
  puts lines.sort
  puts 4.chr
  $stdout.flush
end

while line = gets
  if line[0].ord == 4
    sort(doc, lines)
    doc += 1
    lines = []
  else
    lines << line
  end
end
sort(doc, lines)
