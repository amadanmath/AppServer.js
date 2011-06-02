#!/usr/bin/env ruby

require 'net/http'
require 'cgi'
require 'uri'

BASE_URI = 'http://localhost:3456/'

def invokeApp(uri, data)
  parsed_uri = URI(uri)
  http = Net::HTTP.new(parsed_uri.host, parsed_uri.port)
  http.use_ssl = true if (parsed_uri.scheme == 'https')
  data = "text=#{CGI.escape(data)}"
  headers = {
    'Content-Type' => 'application/x-www-form-urlencoded'
  }

  resp, result = http.post(parsed_uri.path, data, headers)
  result
end


names = <<EOT
John
Jan
Jill
Jane
Jen
Jun
Joan
EOT

puts "--- Cat:"
puts invokeApp(BASE_URI + 'cat', names)
puts "--- Sorter:"
puts invokeApp(BASE_URI + 'sorter', names)
puts "--- Sorter again:"
puts invokeApp(BASE_URI + 'sorter', names)
