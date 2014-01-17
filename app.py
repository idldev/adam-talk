import os
import re
#import pattern
from flask import Flask, render_template, json, jsonify
from random import choice

app = Flask(__name__)


@app.route('/')
def main(id=None):

    quotes = [
        'Just get it done.',
        'The dev team is behind.',
        'Those damn Belorussians.',
        'This is easy to do, right?',
        'How hard will it be to do XYZ?',
        'This is a hotfix.',
        'Add it to the punchlist.',
        'This is a hotfix.',
        'Jesse!',
        'Jesse can you come in here for a second?',
        '...slipped through the cracks',
        'Can we squeeze this into the next sprint?',
        'There\'s so much to do!',
        'Can we hotfix that?',
        'Can we hotfix this?',
        'We have to move faster, guys.',
        'Guys, we just have to move faster.',
        'Not to sound like a broken record, but<br />we HAVE to move faster',
        'Guys, we can\'t slow down.',
        'We need to keep pushing full<br />steam ahead.',
        'I can\'t even look at this, it\'s too buggy.',
        'Any way we can squeeze this into the current sprint?',
        'insert massive eye roll here.',
        'I don\'t know what to tell you, guys.<br />We need it all.',
        'No widows or orphans, guys.<br />No widows or orphans.',
        'It just looks unprofessional.',
        'I\'m having trouble accepting that\'s just the natural order of dev.',
        'You keep floating that balloon, but it\'s just not gonna happen.',
        'We need to take that down',
        'It doesn’t fit our brand image.',
        'How are the blog posts coming along?',
        'There seems to be some confusion...',
        'What\'s the context of this?',
    ]

    quote = choice(quotes)

    return render_template('index.html', quote=quote)


if __name__ == '__main__':
    # Bind to PORT if defined, otherwise default to 5000.
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=True)
