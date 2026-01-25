interface ErrorType {
  error: unknown;
  message: string;
}
export const isError = ({ error, message }: ErrorType) => {
  const isError = error instanceof Error;
  if (isError) console.log(`Error on ${message}: ${error.message}`);
  return isError;
};
