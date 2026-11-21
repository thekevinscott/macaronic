# Variables

A named block is a variable:

```json name=numbers
[1, 2, 3]
```

A later block refers to it with a dollar sign:

```python name=total
sum($numbers)
```

A block in another language can use that result:

```typescript name=doubled
$total * 2;
```
