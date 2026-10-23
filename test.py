stock = [7,1,5,3,6,4]
minprice = stock[0]
maxprice = 0

for i in stock.copy():
    if i < minprice:
        minprice = i

    profit = i - minprice

    if profit > maxprice:
        maxprice = profit

print(minprice,maxprice)
