"""Algoitmo base utilizado apra os matchs"""

def match_lists(list1, list2):
    """Assertiva de entrada: list1 contendo as preferências do usuário
        e list2 contendo as preferências do outro usuário ou do grupo a depender da função

    Assertiva de saída: retorna um número entre 0 e 1 representando a similaridade entre as
    listas de preferências.
    """

    list1_set = set(list1)
    list2_set = set(list2)

    intersection = list1_set.intersection(list2_set)
    union = list1_set.union(list2_set)

    # Conta para porcentagem (2x pois a interseção conta para cada lista)
    return ( len(intersection) / len(union) )
