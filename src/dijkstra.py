"""
This is a gist from shintoishere : https://gist.github.com/shintoishere/f0fa40fe1134b20e7729
CLoned 24/11/2017.
"""

#vertex should start with zero
#if you are giving weight above 999 adjust min in program
#result will be the shortest path and the distace to each vertex from source vertex in order
def dijkstra(matrix,m,n):
    k=int(input("Enter the source vertex"))
    cost=[[0 for x in range(m)] for x in range(1)]
    offsets = []
    offsets.append(k)
    elepos=0
    for j in range(m):
        cost[0][j]=matrix[k][j]
    mini=999
    for x in range (m-1):
        mini=999
        for j in range (m):
                if cost[0][j]<=mini and j not in offsets:
                        mini=cost[0][j]
                        elepos=j
        offsets.append(elepos)
        for j in range (m):
            if cost[0][j] >cost[0][elepos]+matrix[elepos][j]:
                cost[0][j]=cost[0][elepos]+matrix[elepos][j]
    print("The shortest path",offsets)
    print("The cost to various vertices in order",cost)
    
def main():
    print("Dijkstras algorithum graph using matrix representation \n")
    n=int(input("number of elements in row"))
    m=int(input("number of elements in column"))
    #print("enter the values of the matrix")
    matrix=[[0 for x in range(m)] for x in range(n)]
    for i in range (n):
        for j in range (m):
            matrix[i][j]=int(input("enter the values of the matrix"))
    print(matrix)
    dijkstra(matrix,n,m)
main()