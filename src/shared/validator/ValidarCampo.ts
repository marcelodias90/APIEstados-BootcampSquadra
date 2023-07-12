import AppError from '@shared/errors/AppError';

export default class ValidarCampo {
  public static validaNomeCampo(valor: string, campo: string): void {
    if (!valor || valor === '') {
      throw new AppError(`O campo '${campo}' é obrigatório.`, 400);
    }
    const verificarString = /\d/.test(valor);
    if (verificarString) {
      throw new AppError(
        `O campo '${campo}' deve conter somente texto! Foi enviado um valor inválido:  ${valor}`
      );
    }
    if (valor.length < 4) {
      throw new AppError(`O campo '${campo}' deve ter no mínimo 4 caracteres.`);
    }
    if (valor.length > 20) {
      throw new AppError(
        `O campo '${campo}' deve ter no máximo 20 caracteres.`
      );
    }
  }

  public static validaNomeRuaCampo(valor: string, campo: string): void {
    if (!valor || valor === '') {
      throw new AppError(`O campo '${campo}' é obrigatório.`, 400);
    }
    const verificarString = /\d/.test(valor);
    if (verificarString) {
      throw new AppError(
        `O campo '${campo}' deve conter somente texto! Foi enviado um valor inválido:  ${valor}`
      );
    }
    if (valor.length > 40) {
      throw new AppError(
        `O campo '${campo}' deve ter no máximo 40 caracteres.`
      );
    }
    if (valor.length < 6) {
      throw new AppError(`O campo '${campo}' deve ter no mínimo 6 caracteres.`);
    }
  }
  public static validaComplementoCampo(valor: string, campo: string): void {
    if (!valor || valor === '') {
      throw new AppError(`O campo '${campo}' é obrigatório.`, 400);
    }
    if (valor.length > 30) {
      throw new AppError(
        `O campo '${campo}' deve ter no máximo 30 caracteres.`
      );
    }
    if (valor.length < 4) {
      throw new AppError(`O campo '${campo}' deve ter no mínimo 4 caracteres.`);
    }
  }

  public static validaEmailCampo(valor: string, campo: string): void {
    if (!valor || valor === '') {
      throw new AppError(`O campo '${campo}' é obrigatório.`, 400);
    }
    if (valor.length > 28) {
      throw new AppError(
        `O campo '${campo}' deve ter no máximo 28 caracteres.`
      );
    }
    if (valor.length < 10) {
      throw new AppError(
        `O campo '${campo}' deve ter no mínimo 10 caracteres.`
      );
    }
  }

  public static validaSobreNomeCampo(valor: string, campo: string): void {
    if (!valor || valor === '') {
      throw new AppError(`O campo '${campo}' é obrigatório.`, 400);
    }
    const verificarString = /\d/.test(valor);
    if (verificarString) {
      throw new AppError(
        `O campo '${campo}' deve conter somente texto! Foi enviado um valor inválido:  ${valor}`
      );
    }
    if (valor.length > 15) {
      throw new AppError(
        `O campo '${campo}' deve ter no máximo 15 caracteres.`
      );
    }
    if (valor.length < 4) {
      throw new AppError(`O campo '${campo}' deve ter no mínimo 4 caracteres.`);
    }
  }

  public static validaLoginCampo(valor: string, campo: string): void {
    if (!valor || valor === '') {
      throw new AppError(`O campo '${campo}' é obrigatório.`, 400);
    }
    const verificarString = /\d/.test(valor);
    if (verificarString) {
      throw new AppError(
        `O campo '${campo}' deve conter somente texto! Foi enviado um valor inválido:  ${valor}`
      );
    }
    if (valor.length > 20) {
      throw new AppError(
        `O campo '${campo}' deve ter no máximo 20 caracteres.`
      );
    }
    if (valor.length < 8) {
      throw new AppError(`O campo '${campo}' deve ter no mínimo 8 caracteres.`);
    }
  }

  public static validaSenhaCampo(valor: string, campo: string): void {
    if (!valor || valor === '') {
      throw new AppError(`O campo '${campo}' é obrigatório.`, 400);
    }
    if (valor.length > 15) {
      throw new AppError(
        `O campo '${campo}' deve ter no máximo 15 caracteres.`
      );
    }
    if (valor.length < 6) {
      throw new AppError(`O campo '${campo}' deve ter no mínimo 6 caracteres.`);
    }
  }

  public static validaSiglaCampo(valor: string, campo: string): void {
    if (!valor || valor === '') {
      throw new AppError(`O campo '${campo}' é obrigatório.`, 400);
    }
    const verificarString = /\d/.test(valor);
    if (verificarString) {
      throw new AppError(
        `O campo '${campo}' deve conter somente texto! Foi enviado um valor inválido:  ${valor}`
      );
    }
    if (valor.length < 2) {
      throw new AppError(`O campo '${campo}' deve ter no mínimo 2 caracteres.`);
    }
    if (valor.length > 2) {
      throw new AppError(`O campo '${campo}' deve ter no máximo 2 caracteres.`);
    }
  }

  public static validaIdadeCampo(valor: number, campo: string): void {
    if (valor === null || valor === undefined) {
      throw new AppError(`O campo '${campo}' é obrigatório.`, 400);
    }
    if (isNaN(valor)) {
      throw new AppError(
        `O campo '${campo}' deve ser um número, foi enviado um valor inválido: ${valor}`,
        400
      );
    }
    if (valor.toString().length > 2) {
      throw new AppError(`O campo '${campo}' deve ter no máximo 2 dígito.`);
    }
    if (valor.toString().length < 2) {
      throw new AppError(`O campo '${campo}' deve ter no mínimo 2 dígito.`);
    }
  }

  public static validaNumeroCampo(valor: string, campo: string): void {
    if (!valor || valor === '') {
      throw new AppError(`O campo '${campo}' é obrigatório.`, 400);
    }
    if (valor.length > 4) {
      throw new AppError(`O campo '${campo}' deve ter no máximo 4 caracteres.`);
    }
    if (valor.length < 1) {
      throw new AppError(`O campo '${campo}' deve ter no mínimo 1 caracteres.`);
    }
  }

  public static validarStatusCampo(valor: number, campo: string): void {
    if (valor === null || valor === undefined) {
      throw new AppError(`O campo ${campo} é obrigatório.`, 400);
    }
    if (isNaN(valor)) {
      throw new AppError(
        `O campo '${campo}' deve ser um número, foi enviado um valor inválido: ${valor}`,
        400
      );
    }
    if (valor.toString().length > 1) {
      throw new AppError(`O campo '${campo}' deve ter no máximo 1 dígito.`);
    }
    valor = +valor;
    if (valor !== 1 && valor !== 2) {
      throw new AppError(
        `O campo status é permitido os valores 1(ATIVADO) ou 2(DESATIVADO) foi enviado: ${valor}`
      );
    }
  }
  public static validarCodigoCampo(valor: number, campo: string): void {
    if (valor === null || valor === undefined) {
      throw new AppError(`O campo '${campo}' é obrigatório.`, 400);
    }
    if (isNaN(valor)) {
      throw new AppError(
        `O campo '${campo}' deve conter somente número(s), foi enviado um valor inválido: ${valor}`,
        400
      );
    }
    if (valor.toString().length > 4) {
      throw new AppError(`O campo '${campo}' deve ter no máximo 4 dígitos.`);
    }
    if (valor.toString().length < 1) {
      throw new AppError(`O campo '${campo}' deve ter no mínimo 1 dígito.`);
    }
  }

  public static validarCampo(valor: any, campo: string): void {
    if (!valor || valor === '') {
      throw new AppError(`O campo '${campo}' é obrigatório.`, 400);
    }
  }

  public static validarCampoCep(valor: any, campo: string): void {
    if (!valor || valor === '') {
      throw new AppError(`O campo '${campo}' é obrigatório.`, 400);
    }
    if (isNaN(valor)) {
      throw new AppError(
        `O campo '${campo}' deve conter somente números, foi enviado um valor inválido: ${valor}`,
        400
      );
    }
    if (valor.toString().length < 8 || valor.toString().length > 8) {
      throw new AppError(`O campo '${campo}' deve ter conter  8 dígitos.`);
    }
  }

  public static validarCampoObjeto(valor: any, campo: string): void {
    if (!valor || valor === '') {
      throw new AppError(`O campo '${campo}' é obrigatório.`, 400);
    }
    if (valor.length === 0) {
      throw new AppError(
        `O campo '${campo}' deve conter pelo menos um endereço.`
      );
    }
  }
}
