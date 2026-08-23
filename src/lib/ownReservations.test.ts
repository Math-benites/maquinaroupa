import { beforeEach, describe, expect, it } from 'vitest'
import {
  getAllOwnIds,
  getOwnToken,
  isOwnReservation,
  markEndingSoonNotified,
  removeOwnReservation,
  saveOwnReservation,
  wasEndingSoonNotified,
} from './ownReservations'

beforeEach(() => {
  localStorage.clear()
})

describe('saveOwnReservation / getOwnToken', () => {
  it('salva e recupera o token de cancelamento pelo id', () => {
    saveOwnReservation('r1', 'token-abc')
    expect(getOwnToken('r1')).toBe('token-abc')
  })

  it('retorna null para um id nunca salvo', () => {
    expect(getOwnToken('inexistente')).toBeNull()
  })

  it('sobrescreve o token ao salvar de novo com o mesmo id', () => {
    saveOwnReservation('r1', 'token-antigo')
    saveOwnReservation('r1', 'token-novo')
    expect(getOwnToken('r1')).toBe('token-novo')
  })
})

describe('isOwnReservation', () => {
  it('true quando o id tem token salvo, false quando não tem', () => {
    saveOwnReservation('r1', 'token-abc')
    expect(isOwnReservation('r1')).toBe(true)
    expect(isOwnReservation('r2')).toBe(false)
  })
})

describe('removeOwnReservation', () => {
  it('remove o token, sem afetar outras reservas salvas', () => {
    saveOwnReservation('r1', 'token-1')
    saveOwnReservation('r2', 'token-2')
    removeOwnReservation('r1')
    expect(getOwnToken('r1')).toBeNull()
    expect(getOwnToken('r2')).toBe('token-2')
  })

  it('não quebra ao remover um id que não existe', () => {
    expect(() => removeOwnReservation('fantasma')).not.toThrow()
  })
})

describe('getAllOwnIds', () => {
  it('lista todos os ids salvos', () => {
    saveOwnReservation('r1', 't1')
    saveOwnReservation('r2', 't2')
    expect(getAllOwnIds().sort()).toEqual(['r1', 'r2'])
  })

  it('vazio quando não há nada salvo', () => {
    expect(getAllOwnIds()).toEqual([])
  })

  it('se o localStorage tiver JSON corrompido, trata como vazio em vez de quebrar', () => {
    localStorage.setItem('lavanderia:reservas', 'isso não é json')
    expect(getAllOwnIds()).toEqual([])
  })
})

describe('wasEndingSoonNotified / markEndingSoonNotified', () => {
  it('nao notificado por padrao, e passa a estar depois de marcado', () => {
    expect(wasEndingSoonNotified('r1')).toBe(false)
    markEndingSoonNotified('r1')
    expect(wasEndingSoonNotified('r1')).toBe(true)
  })

  it('marcar de novo o mesmo id nao duplica nem afeta outros ids', () => {
    markEndingSoonNotified('r1')
    markEndingSoonNotified('r1')
    markEndingSoonNotified('r2')
    expect(wasEndingSoonNotified('r1')).toBe(true)
    expect(wasEndingSoonNotified('r2')).toBe(true)
    expect(wasEndingSoonNotified('r3')).toBe(false)
  })
})
