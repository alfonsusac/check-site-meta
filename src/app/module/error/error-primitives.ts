
export type ErrorInfo = {
  type: "input" | "fetch" | "server" | "parse" | "other"
  summary: string,
  detail?: string,
  context: string[],
}

export function createError(
  type: ErrorInfo["type"],
  summary: string,
  detail?: string,
  context?: string[],
): ErrorInfo {
  return { type, summary, detail, context: context ?? [] }
}

export type ParsedError = {
  summary: string,
  detail?: string,
  context: string[],
  stack: string,
  who: string[],
  instanceof?: string
}

export function serializeError(error: unknown) {
  let parsedError: ParsedError = {
    summary: "An unknown error occurred.",
    detail: error instanceof Error ? error.message : '',
    context: [],
    who: [],
    stack: error instanceof Error ? error.stack! : '',
    instanceof: "ParsedAppError"
  }
  if (error instanceof AppError) {
    parsedError = {
      summary: error.summary,
      detail: error.detail,
      context: error.context,
      stack: error.stack!,
      who: error.who,
      instanceof: "ParsedAppError"
    }
  }
  if (typeof error === 'object' && error && 'instanceof' in error && error.instanceof === "ParsedAppError") {
    parsedError = {
      summary: ('summary' in error && typeof error.summary === 'string') ? error.summary : "An unknown error occurred. (s)",
      detail: ('detail' in error && typeof error.detail === 'string') ? error.detail : 'Please contact the developer for more information. (s)',
      context: ('context' in error && Array.isArray(error.context)) ? error.context : [],
      stack: ('stack' in error && typeof error.stack === 'string') ? '(parsed serialized error) ' + error.stack : '',
      who: ('who' in error && Array.isArray(error.who)) ? error.who : [],
      instanceof: "ParsedAppError"
    }
  }
  return parsedError
} 

export class AppError extends Error {

  readonly who: string[]
  readonly summary: string
  readonly detail?: string
  readonly context: string[]
  readonly error: unknown | undefined | null
  readonly allMessage?: string

  constructor(
    /** Custom-made stack implementation */
    who: string,

    /** Title of the error. Fallback to error.message if length < 50. Fallback to "An error occurred". */
    summary?: string,

    /** Description of the error. Fallback to error.message if length not yet a title. */
    detail?: string,

    /** Additional context to help debug the error such as parameters.  */
    context?: string[],
    // Stack trace is automatically included.
    // this.error.message is not used.

    /** The original error. To determine the original stack trace */
    error?: unknown | undefined | null,
  ) {




    let errorMessageUsed = false

    const _summary = summary ?? (error instanceof AppError
      ? error.summary
      : ((error instanceof Error && error.message.length < 50) ? (() => {
        errorMessageUsed = true
        return error.message
      })() : "An error occurred")
    )

    const _detail = detail ?? (error instanceof AppError
      ? error.detail
      : ((error instanceof Error && !errorMessageUsed)
        ? error.message
        : "Please contact the developer for more information."
      )
    )

    const _context = error instanceof AppError
      ? [...error.context, ...context ?? []]
      : context ?? []

    const _who = error instanceof AppError
      ? [who, ...error.who]
      : [who]

    const message = _summary ?? _detail ?? (error instanceof Error ? error.message : "An error occurred")
    super(message)

    this.summary = _summary
    this.detail = _detail
    this.context = _context
    this.who = _who
    this.error = error

    // if (!error) this.error = this // Do NOT do this.
    this.name = "AppError"
    this.stack = error instanceof Error
      ? error.stack
      : this.stack
    
    this.allMessage = [
      `Sum: ` + this.summary,
      `Det: ` + this.detail,
      this.context.length > 0 ? `Ctx: ${this.context.join(', ')}` : '',
      `Stk: ${this.stack}`,
      `Who: ${this.who.join(' > ')}`
    ].join('\n')
  }
}