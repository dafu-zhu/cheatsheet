# Python Cheatsheet

## Data Types

### Strings
```python
s = "Hello, World!"
s.upper()          # "HELLO, WORLD!"
s.lower()          # "hello, world!"
s.split(",")       # ["Hello", " World!"]
```

### Numbers
```python
x = 42             # Integer
y = 3.14           # Float
z = 2 + 3j         # Complex
```

### Lists
```python
lst = [1, 2, 3, 4, 5]
lst.append(6)      # [1, 2, 3, 4, 5, 6]
lst.pop()          # Removes last element
lst[0]             # Access first element
```

## Control Flow

### If Statements
```python
if x > 0:
    print("Positive")
elif x < 0:
    print("Negative")
else:
    print("Zero")
```

### Loops
```python
# For loop
for i in range(5):
    print(i)

# While loop
while x > 0:
    x -= 1

# List comprehension
squares = [x**2 for x in range(10)]
```

## Functions

### Basic Function
```python
def greet(name):
    return f"Hello, {name}!"

# Lambda function
square = lambda x: x**2
```

### Arguments
```python
def func(a, b, *args, **kwargs):
    # a, b: positional
    # args: tuple of extra positional
    # kwargs: dict of keyword args
    pass
```

## Classes

### Basic Class
```python
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def greet(self):
        return f"Hi, I'm {self.name}"

p = Person("Alice", 30)
```

## Common Operations

### Dictionary
| Operation | Code | Result |
|-----------|------|--------|
| Create | `d = {"a": 1, "b": 2}` | New dict |
| Access | `d["a"]` | 1 |
| Add/Update | `d["c"] = 3` | Adds key |
| Keys | `d.keys()` | dict_keys |
| Values | `d.values()` | dict_values |

### String Methods
| Method | Example | Result |
|--------|---------|--------|
| `strip()` | `" hi ".strip()` | "hi" |
| `replace()` | `"hi".replace("i", "o")` | "ho" |
| `join()` | `"-".join(["a","b"])` | "a-b" |
| `find()` | `"hello".find("ll")` | 2 |

## File I/O

```python
# Read file
with open("file.txt", "r") as f:
    content = f.read()

# Write file
with open("file.txt", "w") as f:
    f.write("Hello")
```

## List Methods

```python
lst = [3, 1, 4, 1, 5]
lst.sort()         # [1, 1, 3, 4, 5]
lst.reverse()      # [5, 4, 3, 1, 1]
lst.count(1)       # 2
lst.index(3)       # Index of first 3
```

## Useful Built-ins

```python
len([1, 2, 3])     # 3
max([1, 2, 3])     # 3
min([1, 2, 3])     # 1
sum([1, 2, 3])     # 6
abs(-5)            # 5
round(3.14159, 2)  # 3.14
```

## Exception Handling

```python
try:
    result = 10 / 0
except ZeroDivisionError:
    print("Cannot divide by zero")
except Exception as e:
    print(f"Error: {e}")
finally:
    print("Always runs")
```

---

*Python 3.x Reference*
