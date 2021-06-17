import {computed, ref} from "vue";

export default function useRepositoryNameSearch(repositories) {
    const searchQuery = ref('');
    const repositoriesMatchingSearchQuery = computed(() => {
        return repositories.value.filter(
            repository => repository.name.includes(searchQuery.value)
        )
    })
    return {
        searchQuery,
        repositoriesMatchingSearchQuery
    }
}