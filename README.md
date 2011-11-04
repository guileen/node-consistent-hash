It's easy to use.

```javascript
var Consistent = require('../lib/consistent').Consistent;
var cons = new Consistent(nodes);
var node = cons.get(key);
cons.add(newNode);
node = cons.get(key);
```