An h1 header
============

Paragraphs are separated by a blank line.

2nd paragraph. *Italic*, **bold**, and `monospace`. Itemized lists
look like:

  * this one
  * that one
  * the other one

Note that --- not considering the asterisk --- the actual text
content starts at 4-columns in.

	Block quotes are
	written like so.
	
	They can span multiple paragraphs,
	if you like.

An h2 header
------------

Here's a numbered list:

 1. first item
 2. second item
 3. third item

```
define foobar() {
    print "Welcome to flavor country!";
}
```

~~~python
import time
# Quick, count to ten!
for i in range(10):
    # (but not *too* quick)
    time.sleep(0.5)
    print i
~~~



### An h3 header ###

Now a nested list:

 1. First, get these ingredients:

      * carrots
      * celery
      * lentils

 2. Boil some water.

 3. Dump everything in the pot and follow
    this algorithm:

        find wooden spoon
        uncover pot
        stir
        cover pot
        balance wooden spoon precariously on pot handle
        wait 10 minutes
        goto first step (or shut off burner when done)

    Do not bump wooden spoon or it will fall.

Notice again how text always lines up on 4-space indents (including
that last line which continues item 3 above).

Here's a link to [a website](http://foo.bar), to a [local doc](local-doc.html), and to a [section heading in the current doc](#an-h2-header). Here's a footnote [^1].

Tables can look like this:

size|material    |color
----|------------|------------
9   |leather     |brown
10  |hemp canvas |natural
11  |glass       |transparent


A horizontal rule follows.

***

and images can be specified like so:

![example image](example-image.jpg "An exemplary image")