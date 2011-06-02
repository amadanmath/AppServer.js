AppServer

© 2011 Goran Topić

Licensed under the MIT licence

This small node.js library can be used to expose as a web service a
program with a long startup cost, so that it is only initialised once.

Each wrapped application needs to conform to the following requirements:

* reads input from STDIN
* separates requests by detecting EOT (ASCII 4)
* writes resulting output to STDOUT
* outputs EOT (ASCII 4) when the results for a request are done.

AppServer will pass the data from the POST requests (by default, using
the parameter named "text") to the wrapped applications. If the selected
application is already processing a previous request, the new request
will be queued until the application frees up. The resulting output from
the application will be passed back to the client.

The typical usage is demonstrated in the "example" directory. Run the
server using the following command:

    node server.js

The example server exposes two simple services; `cat` and `sorter`.
`cat` is just the UNIX `/bin/cat` command, which will pass whatever
input it receives back unchanged. It will also pass back the EOT, which
makes it ideal for this demonstration. `sorter` is a small sorting
service implemented in Ruby, which will return the lines of the input
sorted alphabetically. Please inspect `sorter.rb` to see how to adapt
your applications to be used with AppServer (notably, detecting and
outputting EOT, and working in an infinite loop).

You can use `client.rb` to test if the services exposed by the example
`server.js` work.
