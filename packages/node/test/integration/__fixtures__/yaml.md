# YAML

A YAML block is data, like JSON:

```yaml name=fixture
name: three-files
files:
  - a.md
  - b.md
  - c.md
```

A later block can use it:

```python
len($fixture['files'])
```
