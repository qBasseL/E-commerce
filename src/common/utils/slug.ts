export const generateSlug = (text: string) => {
    return text.replaceAll(/\s+/g, '-')
}