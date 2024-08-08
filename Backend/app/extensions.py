import boto3
import os


lex_client = boto3.client('lexv2-runtime', region_name='us-east-1', aws_access_key_id=os.getenv('AWS_ACCESS_KEY'),
                          aws_secret_access_key=os.getenv('AWS_SECRET_KEY'),)
