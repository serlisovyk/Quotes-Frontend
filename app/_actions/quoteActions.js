'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { ROUTES } from '@/constants'
import { deleteQuote, patchQuote, postQuote } from '@services/services'
import {
  createApiErrorState,
  createDeleteApiErrorState,
  createQuoteActionState,
  createQuoteFormValuesFromFormData,
} from '@utils/quoteActionState'
import { createQuotePayload, getQuoteFormValidationErrors } from '@utils/validation'

export async function createQuoteAction(_previousState, formData) {
  const values = createQuoteFormValuesFromFormData(formData)
  const errors = getQuoteFormValidationErrors(values)

  if (Object.keys(errors).length) {
    return createQuoteActionState(values, errors)
  }

  let quote

  try {
    quote = await postQuote(createQuotePayload(values))
  } catch (error) {
    return createApiErrorState(error, values)
  }

  revalidatePath(ROUTES.HOME)
  revalidatePath(ROUTES.SEARCH)
  revalidatePath(ROUTES.RANDOM)

  redirect(`${ROUTES.QUOTES}/${quote.id}?toast=created`)
}

export async function updateQuoteAction(id, _previousState, formData) {
  const values = createQuoteFormValuesFromFormData(formData)
  const errors = getQuoteFormValidationErrors(values)

  if (Object.keys(errors).length) {
    return createQuoteActionState(values, errors)
  }

  try {
    await patchQuote(id, createQuotePayload(values))
  } catch (error) {
    return createApiErrorState(error, values)
  }

  revalidatePath(ROUTES.HOME)
  revalidatePath(ROUTES.SEARCH)
  revalidatePath(ROUTES.RANDOM)
  revalidatePath(`${ROUTES.QUOTES}/${id}`)

  redirect(`${ROUTES.QUOTES}/${id}?toast=updated`)
}

export async function deleteQuoteAction(id) {
  try {
    await deleteQuote(id)
  } catch (error) {
    return createDeleteApiErrorState(error)
  }

  revalidatePath(ROUTES.HOME)
  revalidatePath(ROUTES.SEARCH)
  revalidatePath(ROUTES.RANDOM)
  revalidatePath(`${ROUTES.QUOTES}/${id}`)

  redirect(`${ROUTES.HOME}?toast=deleted`)
}
