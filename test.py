a = ["apple", "banana", "apple", "orange", "banana", "apple"]

b = {}

for frut in a:
    if frut in b:
        b[frut] += 1
    else:
        b[frut] = 1

print(b)