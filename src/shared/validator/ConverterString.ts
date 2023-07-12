export default class ConverterString {
  public static replaceAndToUpperCase(valor: string) {
    const normalize = valor.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const replace = normalize.replace(/\s+/g, ' ').trim();
    const upperCaseAndReplace = replace.toUpperCase();

    return upperCaseAndReplace;
  }
}
