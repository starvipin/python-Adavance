a = [2,5,0,7,0,4,6,0,89]



print(a.index(0))

for value in a.copy():
    if value == 0:
        a.append(0)

        a.remove(0)

print(a)