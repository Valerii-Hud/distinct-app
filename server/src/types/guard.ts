interface ErrorType {
  error: unknown;
  functionName: string;
  handler: 'middleware' | 'controller';
}

export const isError = ({ error, functionName, handler }: ErrorType) => {
  const isError = error instanceof Error;
  if (isError)
    console.log(`Error on  ${functionName} ${handler} : ${error.message}`);
  return isError;
};
